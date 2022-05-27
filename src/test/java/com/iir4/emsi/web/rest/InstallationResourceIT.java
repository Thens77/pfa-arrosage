package com.iir4.emsi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.iir4.emsi.IntegrationTest;
import com.iir4.emsi.domain.Installation;
import com.iir4.emsi.repository.InstallationRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link InstallationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InstallationResourceIT {

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/installations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InstallationRepository installationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInstallationMockMvc;

    private Installation installation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Installation createEntity(EntityManager em) {
        Installation installation = new Installation().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN);
        return installation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Installation createUpdatedEntity(EntityManager em) {
        Installation installation = new Installation().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);
        return installation;
    }

    @BeforeEach
    public void initTest() {
        installation = createEntity(em);
    }

    @Test
    @Transactional
    void createInstallation() throws Exception {
        int databaseSizeBeforeCreate = installationRepository.findAll().size();
        // Create the Installation
        restInstallationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(installation)))
            .andExpect(status().isCreated());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeCreate + 1);
        Installation testInstallation = installationList.get(installationList.size() - 1);
        assertThat(testInstallation.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testInstallation.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createInstallationWithExistingId() throws Exception {
        // Create the Installation with an existing ID
        installation.setId(1L);

        int databaseSizeBeforeCreate = installationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInstallationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(installation)))
            .andExpect(status().isBadRequest());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInstallations() throws Exception {
        // Initialize the database
        installationRepository.saveAndFlush(installation);

        // Get all the installationList
        restInstallationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(installation.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getInstallation() throws Exception {
        // Initialize the database
        installationRepository.saveAndFlush(installation);

        // Get the installation
        restInstallationMockMvc
            .perform(get(ENTITY_API_URL_ID, installation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(installation.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingInstallation() throws Exception {
        // Get the installation
        restInstallationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewInstallation() throws Exception {
        // Initialize the database
        installationRepository.saveAndFlush(installation);

        int databaseSizeBeforeUpdate = installationRepository.findAll().size();

        // Update the installation
        Installation updatedInstallation = installationRepository.findById(installation.getId()).get();
        // Disconnect from session so that the updates on updatedInstallation are not directly saved in db
        em.detach(updatedInstallation);
        updatedInstallation.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restInstallationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInstallation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInstallation))
            )
            .andExpect(status().isOk());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeUpdate);
        Installation testInstallation = installationList.get(installationList.size() - 1);
        assertThat(testInstallation.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testInstallation.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingInstallation() throws Exception {
        int databaseSizeBeforeUpdate = installationRepository.findAll().size();
        installation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInstallationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, installation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(installation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInstallation() throws Exception {
        int databaseSizeBeforeUpdate = installationRepository.findAll().size();
        installation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstallationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(installation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInstallation() throws Exception {
        int databaseSizeBeforeUpdate = installationRepository.findAll().size();
        installation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstallationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(installation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInstallationWithPatch() throws Exception {
        // Initialize the database
        installationRepository.saveAndFlush(installation);

        int databaseSizeBeforeUpdate = installationRepository.findAll().size();

        // Update the installation using partial update
        Installation partialUpdatedInstallation = new Installation();
        partialUpdatedInstallation.setId(installation.getId());

        partialUpdatedInstallation.dateDebut(UPDATED_DATE_DEBUT);

        restInstallationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInstallation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInstallation))
            )
            .andExpect(status().isOk());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeUpdate);
        Installation testInstallation = installationList.get(installationList.size() - 1);
        assertThat(testInstallation.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testInstallation.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateInstallationWithPatch() throws Exception {
        // Initialize the database
        installationRepository.saveAndFlush(installation);

        int databaseSizeBeforeUpdate = installationRepository.findAll().size();

        // Update the installation using partial update
        Installation partialUpdatedInstallation = new Installation();
        partialUpdatedInstallation.setId(installation.getId());

        partialUpdatedInstallation.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restInstallationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInstallation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInstallation))
            )
            .andExpect(status().isOk());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeUpdate);
        Installation testInstallation = installationList.get(installationList.size() - 1);
        assertThat(testInstallation.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testInstallation.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingInstallation() throws Exception {
        int databaseSizeBeforeUpdate = installationRepository.findAll().size();
        installation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInstallationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, installation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(installation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInstallation() throws Exception {
        int databaseSizeBeforeUpdate = installationRepository.findAll().size();
        installation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstallationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(installation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInstallation() throws Exception {
        int databaseSizeBeforeUpdate = installationRepository.findAll().size();
        installation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstallationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(installation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Installation in the database
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInstallation() throws Exception {
        // Initialize the database
        installationRepository.saveAndFlush(installation);

        int databaseSizeBeforeDelete = installationRepository.findAll().size();

        // Delete the installation
        restInstallationMockMvc
            .perform(delete(ENTITY_API_URL_ID, installation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Installation> installationList = installationRepository.findAll();
        assertThat(installationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
