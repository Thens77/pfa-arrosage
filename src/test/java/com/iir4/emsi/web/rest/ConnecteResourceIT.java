package com.iir4.emsi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.iir4.emsi.IntegrationTest;
import com.iir4.emsi.domain.Connecte;
import com.iir4.emsi.repository.ConnecteRepository;
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
 * Integration tests for the {@link ConnecteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConnecteResourceIT {

    private static final Boolean DEFAULT_FONCTIONNEL = false;
    private static final Boolean UPDATED_FONCTIONNEL = true;

    private static final String DEFAULT_BRANCHE = "AAAAAAAAAA";
    private static final String UPDATED_BRANCHE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/connectes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConnecteRepository connecteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConnecteMockMvc;

    private Connecte connecte;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Connecte createEntity(EntityManager em) {
        Connecte connecte = new Connecte().fonctionnel(DEFAULT_FONCTIONNEL).branche(DEFAULT_BRANCHE);
        return connecte;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Connecte createUpdatedEntity(EntityManager em) {
        Connecte connecte = new Connecte().fonctionnel(UPDATED_FONCTIONNEL).branche(UPDATED_BRANCHE);
        return connecte;
    }

    @BeforeEach
    public void initTest() {
        connecte = createEntity(em);
    }

    @Test
    @Transactional
    void createConnecte() throws Exception {
        int databaseSizeBeforeCreate = connecteRepository.findAll().size();
        // Create the Connecte
        restConnecteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(connecte)))
            .andExpect(status().isCreated());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeCreate + 1);
        Connecte testConnecte = connecteList.get(connecteList.size() - 1);
        assertThat(testConnecte.getFonctionnel()).isEqualTo(DEFAULT_FONCTIONNEL);
        assertThat(testConnecte.getBranche()).isEqualTo(DEFAULT_BRANCHE);
    }

    @Test
    @Transactional
    void createConnecteWithExistingId() throws Exception {
        // Create the Connecte with an existing ID
        connecte.setId(1L);

        int databaseSizeBeforeCreate = connecteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConnecteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(connecte)))
            .andExpect(status().isBadRequest());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConnectes() throws Exception {
        // Initialize the database
        connecteRepository.saveAndFlush(connecte);

        // Get all the connecteList
        restConnecteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(connecte.getId().intValue())))
            .andExpect(jsonPath("$.[*].fonctionnel").value(hasItem(DEFAULT_FONCTIONNEL.booleanValue())))
            .andExpect(jsonPath("$.[*].branche").value(hasItem(DEFAULT_BRANCHE)));
    }

    @Test
    @Transactional
    void getConnecte() throws Exception {
        // Initialize the database
        connecteRepository.saveAndFlush(connecte);

        // Get the connecte
        restConnecteMockMvc
            .perform(get(ENTITY_API_URL_ID, connecte.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(connecte.getId().intValue()))
            .andExpect(jsonPath("$.fonctionnel").value(DEFAULT_FONCTIONNEL.booleanValue()))
            .andExpect(jsonPath("$.branche").value(DEFAULT_BRANCHE));
    }

    @Test
    @Transactional
    void getNonExistingConnecte() throws Exception {
        // Get the connecte
        restConnecteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConnecte() throws Exception {
        // Initialize the database
        connecteRepository.saveAndFlush(connecte);

        int databaseSizeBeforeUpdate = connecteRepository.findAll().size();

        // Update the connecte
        Connecte updatedConnecte = connecteRepository.findById(connecte.getId()).get();
        // Disconnect from session so that the updates on updatedConnecte are not directly saved in db
        em.detach(updatedConnecte);
        updatedConnecte.fonctionnel(UPDATED_FONCTIONNEL).branche(UPDATED_BRANCHE);

        restConnecteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConnecte.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConnecte))
            )
            .andExpect(status().isOk());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeUpdate);
        Connecte testConnecte = connecteList.get(connecteList.size() - 1);
        assertThat(testConnecte.getFonctionnel()).isEqualTo(UPDATED_FONCTIONNEL);
        assertThat(testConnecte.getBranche()).isEqualTo(UPDATED_BRANCHE);
    }

    @Test
    @Transactional
    void putNonExistingConnecte() throws Exception {
        int databaseSizeBeforeUpdate = connecteRepository.findAll().size();
        connecte.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConnecteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, connecte.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(connecte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConnecte() throws Exception {
        int databaseSizeBeforeUpdate = connecteRepository.findAll().size();
        connecte.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConnecteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(connecte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConnecte() throws Exception {
        int databaseSizeBeforeUpdate = connecteRepository.findAll().size();
        connecte.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConnecteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(connecte)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConnecteWithPatch() throws Exception {
        // Initialize the database
        connecteRepository.saveAndFlush(connecte);

        int databaseSizeBeforeUpdate = connecteRepository.findAll().size();

        // Update the connecte using partial update
        Connecte partialUpdatedConnecte = new Connecte();
        partialUpdatedConnecte.setId(connecte.getId());

        partialUpdatedConnecte.branche(UPDATED_BRANCHE);

        restConnecteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConnecte.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConnecte))
            )
            .andExpect(status().isOk());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeUpdate);
        Connecte testConnecte = connecteList.get(connecteList.size() - 1);
        assertThat(testConnecte.getFonctionnel()).isEqualTo(DEFAULT_FONCTIONNEL);
        assertThat(testConnecte.getBranche()).isEqualTo(UPDATED_BRANCHE);
    }

    @Test
    @Transactional
    void fullUpdateConnecteWithPatch() throws Exception {
        // Initialize the database
        connecteRepository.saveAndFlush(connecte);

        int databaseSizeBeforeUpdate = connecteRepository.findAll().size();

        // Update the connecte using partial update
        Connecte partialUpdatedConnecte = new Connecte();
        partialUpdatedConnecte.setId(connecte.getId());

        partialUpdatedConnecte.fonctionnel(UPDATED_FONCTIONNEL).branche(UPDATED_BRANCHE);

        restConnecteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConnecte.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConnecte))
            )
            .andExpect(status().isOk());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeUpdate);
        Connecte testConnecte = connecteList.get(connecteList.size() - 1);
        assertThat(testConnecte.getFonctionnel()).isEqualTo(UPDATED_FONCTIONNEL);
        assertThat(testConnecte.getBranche()).isEqualTo(UPDATED_BRANCHE);
    }

    @Test
    @Transactional
    void patchNonExistingConnecte() throws Exception {
        int databaseSizeBeforeUpdate = connecteRepository.findAll().size();
        connecte.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConnecteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, connecte.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(connecte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConnecte() throws Exception {
        int databaseSizeBeforeUpdate = connecteRepository.findAll().size();
        connecte.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConnecteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(connecte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConnecte() throws Exception {
        int databaseSizeBeforeUpdate = connecteRepository.findAll().size();
        connecte.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConnecteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(connecte)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Connecte in the database
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConnecte() throws Exception {
        // Initialize the database
        connecteRepository.saveAndFlush(connecte);

        int databaseSizeBeforeDelete = connecteRepository.findAll().size();

        // Delete the connecte
        restConnecteMockMvc
            .perform(delete(ENTITY_API_URL_ID, connecte.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Connecte> connecteList = connecteRepository.findAll();
        assertThat(connecteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
